import { useState, useRef, useEffect, useCallback } from "react";
import { IoIosNotifications } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import styles from "./Notificationbell.module.css";
import { message, Spin } from "antd";
import { baseUrl } from '../../../store/config.json'
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

import DashboardIcon1 from '../../assets/icons/mapIcon/map1.png'
import DashboardIcon2 from '../../assets/icons/mapIcon/map2.png'
import DashboardIcon3 from '../../assets/icons/mapIcon/map3.png'
import DashboardIcon4 from '../../assets/icons/mapIcon/map4.png'
import DashboardIcon5 from '../../assets/icons/mapIcon/map5.png'
import DashboardIcon6 from '../../assets/icons/mapIcon/map6.png'
import DashboardIcon7 from '../../assets/icons/mapIcon/map7.png'
import DashboardIcon8 from '../../assets/icons/mapIcon/map8.png'
import DashboardIcon9 from '../../assets/icons/mapIcon/map9.png'
import DashboardIcon10 from '../../assets/icons/mapIcon/map10.png'
import DashboardIcon11 from '../../assets/icons/mapIcon/map11.png'
import DashboardIcon12 from '../../assets/icons/mapIcon/map12.png'
import DashboardIcon13 from '../../assets/icons/mapIcon/map13.png'
import TimeAgo from "javascript-time-ago";
import ReactTimeAgo from "react-time-ago";
import { FaAngleDown } from "react-icons/fa6";
import { FaAngleUp } from "react-icons/fa6";




TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)



const INITIAL = [
  {
    id: 1,
    category: "all",
    type: "comment",
    unread: true,
    user: "Caitlyn",
    color: "#d4956a",
    initials: "C",
    action: "commented in",
    chip: { icon: "📊", label: "Dashboard 2.0" },
    timestamp: "Friday 3:12 PM",
    timeAgo: "2 hours ago",
    comment:
      "Could we figure out a way to let people switch between gross and net revenue from this screen?",
  },
  {
    id: 2,
    category: "all",
    type: "follow",
    unread: true,
    user: "Mathilde",
    color: "#b8956a",
    initials: "M",
    action: "followed you",
    chip: null,
    timestamp: "Friday 3:04 PM",
    timeAgo: "2 hours ago",
  },
  {
    id: 3,
    category: "invites",
    type: "invite",
    unread: true,
    user: "Zaid",
    color: "#7a8fa6",
    initials: "Z",
    action: "invited you to",
    chip: { icon: "📝", label: "Blog design" },
    timestamp: "Friday 2:22 PM",
    timeAgo: "3 hours ago",
    inviteStatus: "pending",
  },
  {
    id: 4,
    category: "files",
    type: "file",
    unread: false,
    user: "Lily-Rose",
    color: "#2a2a2a",
    initials: "LR",
    action: "shared a file in",
    chip: { icon: "🌐", label: "Marketing site" },
    timestamp: "Friday 1:40 PM",
    timeAgo: "4 hours ago",
    file: {
      name: "Marketing site v4.0.fig",
      size: "14 MB",
      type: "FIG",
      color: "#7c3aed",
    },
  },
];

const getNotificationItems = (res) => {
  if (Array.isArray(res)) return res;
  return res?.data || res?.notifications || res?.results || res?.docs || res?.items || [];
}

const getHasMore = (res, items) => {
  const responsePage = Number(res?.page || res?.currentPage || res?.pagination?.page);
  const totalPages = Number(res?.totalPages || res?.pagination?.totalPages);

  if (typeof res?.hasMore === "boolean") return res.hasMore;
  if (typeof res?.pagination?.hasMore === "boolean") return res.pagination.hasMore;
  if (responsePage && totalPages) return responsePage < totalPages;

  return items.length > 0;
}

const mergeNotifications = (prev, next) => {
  const seen = new Set(prev.map((item) => item?._id || item?.id).filter(Boolean));

  return next.reduce((list, item) => {
    const key = item?._id || item?.id;

    if (key && seen.has(key)) return list;
    if (key) seen.add(key);

    return [...list, item];
  }, prev);
}

const formatDetailValue = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  return (
    value?.name ||
    value?.fullName ||
    value?.userName ||
    value?.username ||
    value?.title ||
    value?.email ||
    ""
  );
}

const getSenderName = (notification) => {
  return (
    formatDetailValue(notification?.sender) ||
    formatDetailValue(notification?.senderId) ||
    formatDetailValue(notification?.createdBy) ||
    formatDetailValue(notification?.created_by) ||
    formatDetailValue(notification?.user) ||
    formatDetailValue(notification?.userId) ||
    "N/A"
  );
}

const getWorksiteName = (notification) => {
  return (
    formatDetailValue(notification?.worksite) ||
    formatDetailValue(notification?.workSite) ||
    formatDetailValue(notification?.worksiteId) ||
    formatDetailValue(notification?.workSiteId) ||
    formatDetailValue(notification?.worksite_name) ||
    formatDetailValue(notification?.workSiteName) ||
    "N/A"
  );
}

export default function NotificationBell() {
  const token = localStorage.getItem("aX7@qB*9tw!1zV+T2/&1^x==");


  const [currentSetting, setCurrentSetting] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [open, setOpen] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pullStartYRef = useRef(0);
  const isPullingRef = useRef(false);
  const suppressClickRef = useRef(false);



  const LoadSetting = useCallback(async (pageNumber = 1) => {
    if (loadingRef.current || !open || (!hasMoreRef.current && pageNumber !== 1)) return;

    loadingRef.current = true;
    setLoading(true)
    try {
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": `Bearer ${token}`,
        },
      };
      const response = await fetch(`${baseUrl}/notifications?page=${pageNumber}`, options);
      const res = await response.json();
      const items = getNotificationItems(res);

      console.log("Notification Setting", res)
      setCurrentSetting((prev) => pageNumber === 1 ? items : mergeNotifications(prev, items))
      setPage(pageNumber)
      const nextHasMore = getHasMore(res, items);
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore)
    }
    catch {
      messageApi.destroy();
      messageApi.open({
        type: "error",
        content: "Something went wrong",
      });
    }
    finally {
      loadingRef.current = false;
      setLoading(false)
    }
  }, [messageApi, token, open])

  useEffect(() => {
    const loadDataOPS = async () => {
      await LoadSetting(1)
    }
    loadDataOPS()
  }, [LoadSetting])




  const [tab] = useState("all");
  // const [data, setData] = useState(INITIAL);
  const ref = useRef(null);
  const listRef = useRef(null);
  const loaderRef = useRef(null);

  const refreshNotifications = useCallback(async () => {
    if (loadingRef.current || isRefreshing) return;

    setIsRefreshing(true);
    hasMoreRef.current = true;
    setHasMore(true);

    try {
      await LoadSetting(1);
    } finally {
      setIsRefreshing(false);
      setPullDistance(0);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }, [LoadSetting, isRefreshing]);

  const resetPullGesture = () => {
    isPullingRef.current = false;
    document.body.style.userSelect = "";
    document.body.style.webkitUserSelect = "";
  };

  const handlePullStart = (event) => {
    if (!listRef.current || listRef.current.scrollTop > 0 || loadingRef.current) return;

    pullStartYRef.current = event.clientY;
    isPullingRef.current = true;
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";
  };

  const handlePullMove = (event) => {
    if (!isPullingRef.current || !listRef.current || listRef.current.scrollTop > 0) return;

    const distance = event.clientY - pullStartYRef.current;

    if (distance <= 0) {
      setPullDistance(0);
      return;
    }

    event.preventDefault();
    if (distance > 8) suppressClickRef.current = true;
    setPullDistance(Math.min(distance * 0.5, 86));
  };

  const handlePullEnd = () => {
    if (!isPullingRef.current) return;

    resetPullGesture();

    if (pullDistance >= 64) {
      refreshNotifications();
      return;
    }

    setPullDistance(0);
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const handlePullClickCapture = (event) => {
    if (!suppressClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered =
    tab === "all" ? currentSetting : currentSetting?.filter((n) => n.category === tab);

  useEffect(() => {
    if (!open || !loaderRef.current || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) LoadSetting(page + 1);
      },
      { root: listRef.current, rootMargin: "0px 0px 80px 0px" },
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [open, loading, hasMore, page, LoadSetting]);

  return (
    <>
      {contextHolder}
      <div className={styles.wrapper} ref={ref}>
        {/* Bell */}
        <button
          className={`${styles.bellBtn} ${styles.SearchIcon}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Notifications"
        >
          <IoIosNotifications size={22} color="#747474" />
          {/* {unreadCount > 0 && <span className={styles.bellDot} />} */}
        </button>

        {/* Backdrop */}
        {open && (
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
        )}

        {/* Panel */}
        {open && (
          <div className={styles.panel}>
            <div className={styles.header}>
              <p className={styles.title}>Notifications</p>
            </div>


            <hr className={styles.sep} />

            <div
              className={`${styles.list} ${pullDistance > 0 || isRefreshing ? styles.listPulling : ""}`}
              ref={listRef}
              onPointerDown={handlePullStart}
              onPointerMove={handlePullMove}
              onPointerUp={handlePullEnd}
              onPointerCancel={handlePullEnd}
              onPointerLeave={handlePullEnd}
              onClickCapture={handlePullClickCapture}
            >
              <div
                className={`${styles.pullRefresh} ${pullDistance > 0 || isRefreshing ? styles.pullRefreshVisible : ""}`}
                style={{
                  opacity: pullDistance > 8 || isRefreshing ? 1 : 0,
                  transform: `translateY(${Math.min((pullDistance || (isRefreshing ? 64 : 0)) - 54, 20)}px)`,
                }}
              >
                <Spin size="default" />
              </div>
              <div
                className={styles.pullContent}
                style={{
                  transform: `translateY(${pullDistance || (isRefreshing ? 48 : 0)}px)`,
                }}
              >
                {filtered?.length === 0 ? (
                  <div className={styles.empty}>No notifications</div>
                ) : (
                  filtered.map((n) => (
                    <NotifItem
                      key={n._id || n.id}
                      n={n}
                    />
                  ))
                )}
                <div className={styles.bottomLoader} ref={loaderRef}>
                  {loading && !isRefreshing && <Spin />}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function NotifItem({ n }) {
  const [showDetails, setShowDetails] = useState(false);
  const AllIconCenter = {
    POIS: DashboardIcon7,
    ALERTS: DashboardIcon1,
    ASSETS: DashboardIcon2,
    EVACUATIONS: DashboardIcon12,
    PROJECTS: DashboardIcon8,
    SOS: DashboardIcon11,
    WORKORDERS: DashboardIcon5,
    WORKSITES: DashboardIcon3,
    MUSTER: DashboardIcon10,
    MUSTER: DashboardIcon10,
    DAILYPROJECTS: DashboardIcon8,
    TEAMS: DashboardIcon13,
  };

  const routeToDes = (contentId, module) => {
    if (module === "POIS") {
      localStorage.setItem("Zk2@pHL5uy!6mW+L9/=2&y==", contentId)
      window.location.reload()
      window.location.href = '/POI/read';
    }
    if (module === "ALERTS") {
      localStorage.setItem("Pf_!9DqZ@+76MaL#CYxv3tr", contentId)
      window.location.reload()
      window.location.href = '/alerts/read';
    }
    if (module === "ASSETS") {
      localStorage.setItem("Wl2^gTP7ys&1aN$E5-/9hu==", contentId)
      window.location.reload()
      window.location.href = '/assets/read';
    }
    if (module === "PROJECTS") {
      localStorage.setItem("Nq5#eKY6uw^2hX$A8_/4jt==", contentId)
      window.location.reload()
      window.location.href = '/project/read';
    }
    if (module === "WORKORDERS") {
      localStorage.setItem("Xy9#qLT7pw!5kD+M3/=8&v==", contentId)
      window.location.reload()
      window.location.href = '/workorder/read';
    }
    if (module === "WORKSITES") {
      localStorage.setItem("Bm_8Xr#Q+21fGt!zY@Hj6Lp", contentId)
      window.location.reload()
      window.location.href = '/worksite/read';
    }
  }


  const toggleDetails = (event) => {
    event.stopPropagation();
    setShowDetails((value) => !value);
  }


  const formatNotificationDate = (dateInput) => {
    const now = new Date();
    const date = new Date(dateInput);

    const differenceMs = now - date;
    const differenceDays = Math.floor(
      differenceMs / (1000 * 60 * 60 * 24)
    );

    const time = `at ${date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;

    if (differenceDays < 1) {
      return `Today, ${time}`;
    }

    if (differenceDays >= 365) {
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return `${formattedDate}, ${date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}`;
    }

    if (differenceDays >= 30) {
      let months =
        (now.getFullYear() - date.getFullYear()) * 12 +
        (now.getMonth() - date.getMonth());

      let days = now.getDate() - date.getDate();

      if (days < 0) {
        months--;

        const previousMonth = new Date(
          now.getFullYear(),
          now.getMonth(),
          0
        );

        days += previousMonth.getDate();
      }

      if (days === 0) {
        return `${months} month${months > 1 ? "s" : ""} ago, ${time}`;
      }

      return `${months} month${months > 1 ? "s" : ""} ${days} day${days > 1 ? "s" : ""
        } ago, ${time}`;
    }

    return `${differenceDays} day${differenceDays > 1 ? "s" : ""} ago, ${time}`;
  };

  return (
    <div className={styles.item} onClick={() => routeToDes(n?.contentId, n?.module)}>
      <div className={styles.avatarWrap}>
        <img style={{ height: 40, width: 40 }} src={AllIconCenter[n?.module]} alt="Icon" />
      </div>

      <div className={styles.body}>
        <div className={styles.row1}>
          <p className={styles.textWrapTitle}>{n?.title}</p>
          <p className={styles.textWrapDescription}>{n?.body}</p>
          {n?.createdAt && (
            <div className={styles.textWrapDescription2}>
              {/* <ReactTimeAgo date={n.createdAt} /> */}
              {/* <span style={{ marginTop: 2 }}>, {new Date(n?.createdAt).toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}</span> */}
              <span style={{ marginTop: 2 }}>{formatNotificationDate(n.createdAt)}</span>

            </div>
          )}

          <button className={styles.readMoreBtn} type="button" onClick={toggleDetails}>
            {showDetails ? "Show less" : "Read more"}{showDetails ? <FaAngleUp /> : <FaAngleDown />}

          </button>

          {showDetails && (
            <div className={styles.detailSection}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Sender</span>
                <span className={styles.detailValue}>{n?.sender?.firstName} {n?.sender?.lastName}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Worksite</span>
                <span className={styles.detailValue}>{getWorksiteName(n)}</span>
              </div>
            </div>
          )}
        </div>

        <p className={styles.timestamp}>{n.timestamp}</p>
      </div>
    </div>
  );
}
